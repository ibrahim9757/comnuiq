// Cache helper functions
import redis from "../config/redis.js";
const USER_SESSION_TTL = 1800;
const USER_SESSION_PREFIX = "session:";
const USER_SOCKET_PREFIX = "user:";
const SOCKET_PREFIX = "socket:";

// USER SESSION CACHE
export const getCachedUser = async (userId) => {
  try {
    const cached = await redis.get(`${USER_SESSION_PREFIX}${userId}`);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch (parseError) {
      console.error("Cache parse error:", parseError.message);
      return null;
    }
  } catch (error) {
    console.error("Cache get error:", error.message);
    return null;
  }
};

export const setCachedUser = async (userId, userData) => {
  try {
    await redis.setex(
      `${USER_SESSION_PREFIX}${userId}`,
      USER_SESSION_TTL,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error("Cache set error:", error.message);
  }
};

export const deleteCachedUser = async (userId) => {
  try {
    await redis.del(`${USER_SESSION_PREFIX}${userId}`);
  } catch (error) {
    console.log("Cache delete error", error);
  }
};

// ONLINE PRESENCE
export const setUserOnline = async (userId, socketId) => {
  try {
    const oldSocketId = await redis.get(`${USER_SOCKET_PREFIX}${userId}`);
    if (oldSocketId) {
      await redis.del(`${SOCKET_PREFIX}${oldSocketId}`);
    }

    await redis.set(`${USER_SOCKET_PREFIX}${userId}`, socketId);
    await redis.set(`${SOCKET_PREFIX}${socketId}`, userId);
  } catch (error) {
    console.error("Set online error:", error.message);
  }
};

export const setUserOffline = async (socketId) => {
  try {
    const userId = await redis.get(`${SOCKET_PREFIX}${socketId}`);
    if (userId) {
      await redis.del(`${USER_SOCKET_PREFIX}${userId}`);
    }
    await redis.del(`${SOCKET_PREFIX}${socketId}`);
  } catch (error) {
    console.error("Set offline error:", error.message);
  }
};

export const getUserSocketId = async (userId) => {
  try {
    return await redis.get(`${USER_SOCKET_PREFIX}${userId}`);
  } catch (error) {
    console.error("Get socket error:", error.message);
    return null;
  }
};

export const isUserOnline = async (userId) => {
  try {
    const socketId = await redis.get(`${USER_SOCKET_PREFIX}${userId}`);
    return socketId !== null;
  } catch (error) {
    console.error("Check online error:", error.message);
    return false;
  }
};
