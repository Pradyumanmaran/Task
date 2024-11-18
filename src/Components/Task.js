import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import task from "./task.css";

const TaskManager = () => {
    const [tasks, setTasks] = useState([
        {
            taskName: "Task-1",
            docs: ["Document-1"],
            files: [null],
        },
    ]);

    const [selectedIndices, setSelectedIndices] = useState({
        activeTaskIndex: 0,
        activeDocIndex: 0,
    });

    const [isFileSectionVisible, setFileSectionVisibility] = useState(false);

    const selectTask = (index) => {
        setSelectedIndices({ activeTaskIndex: index, activeDocIndex: 0 });
        setFileSectionVisibility(false);
    };

    const selectDocument = (index) => {
        setSelectedIndices((prev) => ({ ...prev, activeDocIndex: index }));
        setFileSectionVisibility(true);
    };

    const addTask = () => {
        const newTask = {
            taskName: `Task-${tasks.length + 1}`,
            docs: [],
            files: [],
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const addDocument = () => {
        const taskIndex = selectedIndices.activeTaskIndex;

        if (taskIndex !== null) {
            const newDocName = `Document-${tasks[taskIndex].docs.length + 1}`;

            setTasks((prev) => {
                const updatedTasks = [...prev];
                updatedTasks[taskIndex] = {
                    ...updatedTasks[taskIndex],
                    docs: [...updatedTasks[taskIndex].docs, newDocName],
                    files: [...updatedTasks[taskIndex].files, null],
                };
                return updatedTasks;
            });
        }
    };

    const deleteTask = (index) => {
        setTasks((prev) => {
            const remainingTasks = prev.filter((_, i) => i !== index);
            const reorderedTasks = remainingTasks.map((task, idx) => ({
                ...task,
                taskName: `Task-${idx + 1}`,
            }));

            if (selectedIndices.activeTaskIndex === index) {
                setSelectedIndices({
                    activeTaskIndex: reorderedTasks.length > 0 ? 0 : null,
                    activeDocIndex: 0,
                });
            }

            return reorderedTasks;
        });
    };

    const deleteDocument = (index) => {
        const taskIndex = selectedIndices.activeTaskIndex;
        if (taskIndex !== null) {
            setTasks((prev) => {
                const updatedTasks = [...prev];
                const updatedDocs = updatedTasks[taskIndex].docs.filter(
                    (_, docIdx) => docIdx !== index
                );
                updatedTasks[taskIndex].docs = updatedDocs.map(
                    (_, idx) => `Document-${idx + 1}`
                );
                return updatedTasks;
            });

            if (selectedIndices.activeDocIndex === index) {
                setSelectedIndices((prev) => ({
                    ...prev,
                    activeDocIndex: 0,
                }));
                setFileSectionVisibility(false);
            }
        }
    };

    const navigateBack = () => {
        const { activeTaskIndex, activeDocIndex } = selectedIndices;

        if (activeDocIndex > 0) {
            setSelectedIndices((prev) => ({
                ...prev,
                activeDocIndex: activeDocIndex - 1,
            }));
        } else if (activeTaskIndex > 0) {
            const previousTask = tasks[activeTaskIndex - 1];
            setSelectedIndices({
                activeTaskIndex: activeTaskIndex - 1,
                activeDocIndex: previousTask.docs.length - 1,
            });
        }
    };

    const navigateNext = () => {
        const { activeTaskIndex, activeDocIndex } = selectedIndices;
        const currentTask = tasks[activeTaskIndex];

        if (activeDocIndex < currentTask.docs.length - 1) {
            setSelectedIndices((prev) => ({
                ...prev,
                activeDocIndex: activeDocIndex + 1,
            }));
        } else if (activeTaskIndex < tasks.length - 1) {
            setSelectedIndices({
                activeTaskIndex: activeTaskIndex + 1,
                activeDocIndex: 0,
            });
        }
    };

    const activeTask =
        selectedIndices.activeTaskIndex !== null
            ? tasks[selectedIndices.activeTaskIndex]
            : null;
    const activeDoc =
        selectedIndices.activeDocIndex !== null
            ? activeTask?.docs[selectedIndices.activeDocIndex]
            : null;

    return (
        <main>
            <header>
                {tasks.map((task, index) => (
                    <button
                        key={index}
                        onClick={() => selectTask(index)}
                        className={index === selectedIndices.activeTaskIndex ? "selected" : "button"}
                    >
                        {task.taskName}
                        <FaTrash onClick={() => deleteTask(index)} />
                    </button>
                ))}
                <button onClick={addTask}>+ Add Task</button>
            </header>

            <section id="bodyContent" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div id="currentlyViewing" style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.5rem" }}>
                    <p>
                        Currently Viewing:{" "}
                        <strong>{activeDoc || "No Document"}</strong> in{" "}
                        <strong>{activeTask?.taskName || "No Task"}</strong>
                    </p>
                </div>

                <section
                    id="documentContainer"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "200px",
                    }}
                >
                    {activeTask?.docs.map((doc, index) => (
                        <button
                            key={index}
                            onClick={() => selectDocument(index)}
                            className={index === selectedIndices.activeDocIndex ? "selected" : "button"}
                            style={{
                                textAlign: "left",
                                padding: "0.5rem 1rem",
                                // width:"100px"
                            }}
                        >
                            {doc}
                            <FaTrash onClick={() => deleteDocument(index)} style={{ marginLeft: "10px" }} />
                        </button>
                    ))}
                    {activeTask && (
                        <button
                            onClick={addDocument}
                            style={{
                                padding: "0.5rem 1rem",
                                border: "1px solid #ccc",
                                background: "#f0f0f0",
                                cursor: "pointer",
                                // width:"100px"
                            }}
                        >
                            + Add Document
                        </button>
                    )}
                </section>
            </section>

            <footer>
                <button onClick={navigateBack} disabled={selectedIndices.activeTaskIndex === 0 && selectedIndices.activeDocIndex === 0}>
                    Back
                </button>
                {"  "}
                <button
                    onClick={navigateNext}
                    disabled={
                        selectedIndices.activeTaskIndex === tasks.length - 1 &&
                        selectedIndices.activeDocIndex === (activeTask?.docs.length || 1) - 1
                    }
                >
                    Next
                </button>
            </footer>
        </main>
    );
};

export default TaskManager;
