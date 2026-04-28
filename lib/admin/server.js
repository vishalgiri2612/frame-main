import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export function parsePagination(searchParams, config = {}) {
  const defaultLimit = Number(config.defaultLimit ?? 20);
  const maxLimit = Number(config.maxLimit ?? 100);

  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const requestedLimit = Number(searchParams.get("limit") || defaultLimit);
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function parseSort(searchParams, allowedFields, fallback = { createdAt: -1 }) {
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

  if (sortBy && allowedFields.includes(sortBy)) {
    return { [sortBy]: sortOrder };
  }

  return fallback;
}

export function containsFilter(fieldName, value) {
  if (!value) return {};

  return {
    [fieldName]: {
      $regex: escapeRegExp(value),
      $options: "i",
    },
  };
}

export function toObjectId(value) {
  if (!value || !ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
}

export function serializeId(doc) {
  if (!doc) return doc;

  const { _id, ...rest } = doc;
  return {
    id: _id?.toString?.() ?? _id,
    ...rest,
  };
}

export function serializeList(docs) {
  return docs.map(serializeId);
}

export function asDate(value) {
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
