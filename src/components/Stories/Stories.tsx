import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { rxjsStore } from '../../store/rxjsStore';
import EditStory from '../EditStory/EditStory';
import StoryForm from '../StoryForm/StoryForm';
import { State, Story } from '../../types/story';
import { Task } from '../../types/task';
import { Project } from '../../types/project';

import * as S from './Stories.styled';
import TaskForm from '../TaskForm/TaskForm';
import EditTask from '../EditTask/EditTask';

const Stories = () => {
  const [activeProjectId, setActiveProjectId] = useState<number>();
  const [projects, setProjects] = useState<Project[] | null>();
  const [stories, setStories] = useState<Story[] | null>();
  const [tasks, setTasks] = useState<Task[] | null>();

  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const [editedStoryId, setEditedStoryId] = useState<number>();
  const [editedTaskId, setEditedTaskId] = useState<number>();

  const activeProjectStories = stories?.filter(
    (story) => story.projectId === activeProjectId
  );

  const handleDeleteStory = (storyId: number) => {
    if (!stories) {
      return;
    }

    const filteredStories = [...stories].filter(({ id }) => id !== storyId);

    const tasks = rxjsStore.getStoreTasks().getValue();

    if (tasks) {
      const filteredTasks = tasks.filter((task) => task.storyId !== storyId);
      rxjsStore.setStoreTasks(filteredTasks);
    }

    rxjsStore.setStoreStories(filteredStories);
  };

  const handleDeleteTask = (taskId: number) => {
    if (!tasks) {
      return;
    }

    const filteredTasks = [...tasks].filter(({ id }) => id !== taskId);
    rxjsStore.setStoreTasks(filteredTasks);
  };

  const renderTasks = (state: State) => {
    if (!activeProjectStories || !tasks) {
      return;
    }

    const activeProjectStoriesIds = activeProjectStories.map(
      (story) => story.id
    );

    const activeProjectTasks = tasks.filter((task) =>
      activeProjectStoriesIds.includes(task.storyId)
    );

    return activeProjectTasks.map((task) => {
      if (task.state === state) {
        return (
          <S.TaskWrapper key={task.id}>
            <S.TaskLabel>{task.name}</S.TaskLabel>
            <DeleteOutlined
              style={{ fontSize: 24, color: 'red' }}
              onClick={() => handleDeleteTask(task.id)}
            />
            <EditOutlined
              style={{ fontSize: 24, color: 'blue' }}
              onClick={() => {
                setEditedTaskId(task.id);
                setIsEditTaskModalOpen(true);
              }}
            />
          </S.TaskWrapper>
        );
      }
    });
  };

  const renderStories = (state: State) => {
    if (!activeProjectStories) {
      return;
    }

    return activeProjectStories.map((story) => {
      if (story.state === state) {
        return (
          <React.Fragment key={story.id}>
            <S.StoryWrapper key={story.id}>
              <p>{story.name}</p>
              <DeleteOutlined
                style={{ fontSize: 24, color: 'red' }}
                onClick={() => handleDeleteStory(story.id)}
              />
              <EditOutlined
                style={{ fontSize: 24, color: 'blue' }}
                onClick={() => {
                  setEditedStoryId(story.id);
                  setIsEditStoryModalOpen(true);
                }}
              />
            </S.StoryWrapper>
          </React.Fragment>
        );
      }
    });
  };

  useEffect(() => {
    rxjsStore.getStoreActiveProject().subscribe((id) => {
      setActiveProjectId(id);
    });

    rxjsStore.getStoreStories().subscribe((stories) => {
      setStories(stories);
    });

    rxjsStore.getStoreTasks().subscribe((tasks) => {
      setTasks(tasks);
    });

    rxjsStore.getStoreProjects().subscribe((projects) => {
      setProjects(projects);
    });
  }, []);

  return (
    <S.Wrapper>
      {projects?.length ? (
        <>
          <S.HeadingWrapper>
            <Typography>Active project stories:</Typography>
            <PlusOutlined
              style={{ fontSize: 24, color: 'green' }}
              onClick={() => setIsAddStoryModalOpen(true)}
            />
          </S.HeadingWrapper>
          {activeProjectStories && (
            <>
              <S.KanbanWrapper>
                <Card title="To do">
                  <S.StoriesWrapper>
                    {/* <S.StatusLabel>To do</S.StatusLabel> */}
                    <S.Stories>{renderStories('todo')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>

                <Card title="Doing">
                  <S.StoriesWrapper>
                    <S.Stories>{renderStories('doing')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>

                <Card title="Done">
                  <S.StoriesWrapper>
                    <S.Stories>{renderStories('done')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>
              </S.KanbanWrapper>

              <S.HeadingWrapper>
                <Typography>Active project tasks:</Typography>

                <PlusOutlined
                  style={{ fontSize: 24, color: 'green' }}
                  onClick={() => setIsAddTaskModalOpen(true)}
                />
              </S.HeadingWrapper>

              <S.KanbanWrapper>
                <Card title="To do">
                  <S.StoriesWrapper>
                    <S.Stories>{renderTasks('todo')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>

                <Card title="Doing">
                  <S.StoriesWrapper>
                    <S.Stories>{renderTasks('doing')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>

                <Card title="Done">
                  <S.StoriesWrapper>
                    <S.Stories>{renderTasks('done')}</S.Stories>
                  </S.StoriesWrapper>
                </Card>
              </S.KanbanWrapper>
            </>
          )}

          {editedStoryId && (
            <EditStory
              isModalOpen={isEditStoryModalOpen}
              setIsModalOpen={setIsEditStoryModalOpen}
              storyId={editedStoryId}
            />
          )}

          {editedTaskId && (
            <EditTask
              isModalOpen={isEditTaskModalOpen}
              setIsModalOpen={setIsEditTaskModalOpen}
              taskId={editedTaskId}
            />
          )}

          {/* {newTaskStoryId && ( */}
          <TaskForm
            isModalOpen={isAddTaskModalOpen}
            // storyId={newTaskStoryId}
            setIsModalOpen={setIsAddTaskModalOpen}
          />
          {/* )} */}

          <StoryForm
            isModalOpen={isAddStoryModalOpen}
            setIsModalOpen={setIsAddStoryModalOpen}
          />
        </>
      ) : null}
    </S.Wrapper>
  );
};

export default Stories;
