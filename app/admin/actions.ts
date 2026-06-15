"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export type ActionState = { error?: string; success?: string } | null;

// ---------------- Users ----------------

const userSchema = z.object({
  email: z.string().email("Enter a valid email."),
  name: z.string().trim().optional(),
  password: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

export async function createUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = userSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role") ?? "USER",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, name, password, role } = parsed.data;

  if (password && password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) return { error: "A user with that email already exists." };

  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name || null,
      role,
      passwordHash: password ? await bcrypt.hash(password, 10) : null,
    },
  });

  revalidatePath("/admin/users");
  return { success: "User created." };
}

export async function setUserRole(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "USER";
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  if (id === session.user.id) return; // don't delete yourself
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ---------------- Groups ----------------

export async function createGroup(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Group name is required." };

  const existing = await prisma.group.findUnique({ where: { name } });
  if (existing) return { error: "A group with that name already exists." };

  await prisma.group.create({
    data: { name, description: description || null },
  });
  revalidatePath("/admin/groups");
  return { success: "Group created." };
}

export async function deleteGroup(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.group.delete({ where: { id } });
  revalidatePath("/admin/groups");
}

export async function addGroupMember(formData: FormData) {
  await requireAdmin();
  const groupId = String(formData.get("groupId"));
  const userId = String(formData.get("userId"));
  if (!userId) return;
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId, groupId } },
    create: { userId, groupId },
    update: {},
  });
  revalidatePath("/admin/groups");
}

export async function removeGroupMember(formData: FormData) {
  await requireAdmin();
  const groupId = String(formData.get("groupId"));
  const userId = String(formData.get("userId"));
  await prisma.groupMember
    .delete({ where: { userId_groupId: { userId, groupId } } })
    .catch(() => undefined);
  revalidatePath("/admin/groups");
}

// ---------------- Meets ----------------

const meetSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().optional(),
  url: z.string().url("Enter a valid meeting URL."),
});

export async function createMeet(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = meetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    url: formData.get("url"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const userIds = formData.getAll("userIds").map(String).filter(Boolean);
  const groupIds = formData.getAll("groupIds").map(String).filter(Boolean);

  await prisma.meet.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      url: parsed.data.url,
      assignments: {
        create: [
          ...userIds.map((userId) => ({ userId })),
          ...groupIds.map((groupId) => ({ groupId })),
        ],
      },
    },
  });

  revalidatePath("/admin/meets");
  return { success: "Meet created and assigned." };
}

export async function deleteMeet(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.meet.delete({ where: { id } });
  revalidatePath("/admin/meets");
}

export async function addMeetAssignment(formData: FormData) {
  await requireAdmin();
  const meetId = String(formData.get("meetId"));
  const target = String(formData.get("target")); // "user:<id>" or "group:<id>"
  const [kind, id] = target.split(":");
  if (!id) return;

  try {
    if (kind === "user") {
      await prisma.meetAssignment.create({ data: { meetId, userId: id } });
    } else if (kind === "group") {
      await prisma.meetAssignment.create({ data: { meetId, groupId: id } });
    }
  } catch {
    // unique constraint -> already assigned, ignore
  }
  revalidatePath("/admin/meets");
}

export async function removeMeetAssignment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.meetAssignment.delete({ where: { id } }).catch(() => undefined);
  revalidatePath("/admin/meets");
}
