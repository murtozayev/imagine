import baseError from "../error/base.error.js";
import AUTH from "../models/auth.model.js";
import MAIN from "../models/main.model.js";

export async function getAll(_, res) {
  try {
    const allPost = await MAIN.find();

    if (!allPost || allPost.length < 1) {
      return baseError(res, 404, "Any post didn't find");
    }

    return res.status(200).json({ result: allPost });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function getOne(req, res) {
  try {
    const { id } = req.params;

    const post = await MAIN.findById(id);

    if (!post) {
      return baseError(res, 404, "Post didn't found");
    }

    return res.status(200).json({ result: post });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function create(req, res) {
  try {
    const { title, desc, image } = req.body;
    const userId = req.user.id;

    if (!title || !desc || !image) {
      return baseError(res, 400, "Data doesn't full");
    }

    if (!userId) {
      return baseError(res, 401, "User unauthorized");
    }

    const newPost = await MAIN.create({ author: userId, title, desc, image });

    return res.status(201).json({ message: "Post created", result: newPost });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function update(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return baseError(res, 401, "User unauthorized");
    }

    const userId = req.user.id;

    const post = await MAIN.findOneAndUpdate(
      {
        author: userId,
        _id: req.params.id,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (!post) {
      return baseError(res, 404, "Post not found or not authorized");
    }

    return res.status(200).json({ message: "Post updated", result: post });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function deletePost(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return baseError(res, 401, "User unauthorized");
    }

    const deletedPost = await MAIN.findOneAndDelete({
      author: req.user.id,
      _id: req.params.id,
    });

    if (!deletedPost) {
      return baseError(res, 404, "Post not found or not authorized");
    }

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function likeUnlike(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return baseError(res, 401, "Unauthorized");
    }

    const user = await AUTH.findById(req.user.id);

    if (!user) {
      return baseError(res, 404, "User not found");
    }

    const post = await MAIN.findById(req.params.id);

    if (!post) {
      return baseError(res, 404, "Post not found");
    }

    const isLiked = post.likes.includes(user.id);

    if (!isLiked) {
      post.likes.push(user.id);
    } else {
      post.likes = post.likes.filter((p) => p !== user.id);
    }

    await post.save();

    return res.status(200).json({ result: post.likes.length });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}
