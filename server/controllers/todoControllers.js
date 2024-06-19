import { Todo } from "../models/todo.js";

export const newTodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    await Todo.create({
      title,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Todo Added Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTodo = async (req, res, next) => {
  try {
    const userId = req.user;
    console.log("haha:", userId);
    const tasks = await Todo.find({
      user: userId,
    });
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};
export const updateTodo = async (req, res, next) => {
  try {
    const task = await Todo.findById(req.params.id);

    if (!task) return next(new ErrorHandler("Task not Found", 404));

    // Create updated data object excluding isCompleted unless explicitly provided
    const updatedData = { ...req.body };

    if (req.body.isCompleted === undefined) {
      delete updatedData.isCompleted; // Ensure isCompleted is not updated if not provided
    }

    const updatedTask = await Todo.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const task = await Todo.findById(req.params.id);

    // if (!task) return next(new ErrorHandler("Todo not Found", 404));

    task.isCompleted = !task.isCompleted;

    await task.save();

    await Todo.deleteOne();

    res.status(200).json({
      success: true,
      message: "Todo Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
