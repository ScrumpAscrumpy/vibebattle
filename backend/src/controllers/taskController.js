import {
  createTaskRecord,
  findTaskById,
  getJoinStatusForTask,
  getSubmissionList,
  getTaskList,
  joinTaskById,
  saveTaskSubmission,
} from "../services/taskService.js";
import { HttpError } from "../utils/httpError.js";
import { requireRole } from "../middlewares/requireRole.js";

export async function getTasks(req, res, next) {
  try {
    const tasks = await getTaskList(req.query);
    res.json({
      data: tasks,
      meta: {
        count: tasks.length,
        filters: {
          status: req.query.status ?? null,
          orderBy: req.query.orderBy ?? "createdAt",
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await findTaskById(req.params.id);

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function getTaskJoinStatus(req, res, next) {
  try {
    const result = await getJoinStatusForTask(req.params.id, req.currentUser);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await createTaskRecord(req.body, req.currentUser);
    res.status(201).json({
      data: task,
      meta: {
        message: "Task created",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function joinTask(req, res, next) {
  try {
    const result = await joinTaskById(req.params.id, req.currentUser);
    res.status(201).json({
      data: result,
      meta: {
        message: "Task joined",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitTaskWork(req, res, next) {
  try {
    const submission = await saveTaskSubmission(req.params.id, req.body, req.currentUser);
    res.status(201).json({
      data: submission,
      meta: {
        message: "Submission created",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskSubmissions(req, res, next) {
  try {
    const submissions = await getSubmissionList(req.params.id);
    res.json({
      data: submissions,
      meta: {
        count: submissions.length,
      },
    });
  } catch (error) {
    next(error);
  }
}
