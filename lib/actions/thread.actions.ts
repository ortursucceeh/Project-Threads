"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "./user.actions";

export async function fetchThreads(pageNumber = 1, pageSize = 5) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const threadsQuery = Thread.find({ parentId: { $exists: false } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
      },
    })
    .populate({
      path: "likes",
      model: User,
      select: "id _id",
    });

  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const threads = await threadsQuery.exec();

  const isNext = totalThreadsCount > skipAmount + threads.length;

  return { threads: JSON.parse(JSON.stringify(threads)), isNext };
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    // console.log("comid :>> ", communityId);

    const communityIdObject = await Community.findOne(
      // its null
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      // .populate({
      //   path: "likes",
      //   model: User,
      //   select: "id _id",
      // })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();
    console.log("path from comment :>> ", path);
    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function addLikeToThread(
  threadId: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    const user = await fetchUser(userId);

    if (!user) {
      throw new Error("Error to fetch user");
    }

    const isLiked = thread.likes.includes(user._id);

    // console.log("userId :>> ", userId);
    // console.log("user._id :>> ", user._id);
    // console.log("threadId :>> ", threadId);
    // console.log("thread.likes :>> ", thread.likes);
    // console.log("hasLiked :>> ", hasLiked);

    if (isLiked) {
      thread.likes = thread.likes.filter(
        (likeUserId: any) => likeUserId.toString() !== user._id.toString()
      );
    } else {
      thread.likes.push(user._id);
    }

    await thread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error to like thread:", err);
    throw new Error("Unable to like thread");
  }
}

export async function saveThread(
  threadId: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    const user = await fetchUser(userId);

    if (!user) {
      throw new Error("Error to fetch user");
    }

    const isSaved = user.saved.includes(thread._id);

    if (isSaved) {
      user.saved = user.saved.filter(
        (saveThreadId: any) => saveThreadId.toString() !== thread._id.toString()
      );
    } else {
      user.saved.push(thread._id);
    }

    await user.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while saving thread:", err);
    throw new Error("Unable to save thread");
  }
}
