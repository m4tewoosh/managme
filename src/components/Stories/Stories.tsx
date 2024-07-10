import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { rxjsStore } from '../../store/rxjsStore';
import EditStory from '../EditStory/EditStory';
import StoryForm from '../StoryForm/StoryForm';
import { State, Story } from '../../types/story';
import { Task } from '../../types/task';
import { Project } from '../../types/project';

import * as S from './Stories.styled';
import TaskForm from '../TaskForm/TaskForm';

const Stories = () => {
  const [activeProjectId, setActiveProjectId] = useState<number>();
  const [projects, setProjects] = useState<Project[] | null>();
  const [stories, setStories] = useState<Story[] | null>();
  const [tasks, setTasks] = useState<Task[] | null>();

  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const [editedStoryId, setEditedStoryId] = useState<number>();
  const [newTaskStoryId, setNewTaskStoryId] = useState<number>();
  // const [editedTaskId, setEditedTaskId] = useState<number>();

  const activeProjectStories = stories?.filter(
    (story) => story.projectId === activeProjectId
  );

  const handleDeleteStory = (storyId: number) => {
    if (!stories) {
      return;
    }

    const filteredStories = [...stories].filter(({ id }) => id !== storyId);
    rxjsStore.setStoreStories(filteredStories);
  };

  const handleDeleteTask = (taskId: number) => {
    if (!tasks) {
      return;
    }

    const filteredTasks = [...tasks].filter(({ id }) => id !== taskId);
    rxjsStore.setStoreTasks(filteredTasks);
  };

  const renderStories = (state: State) => {
    if (!activeProjectStories) {
      return;
    }

    return activeProjectStories.map((story) => {
      let storyTasks: Task[] | null = null;

      if (tasks?.length) {
        storyTasks = tasks.filter((task) => task.storyId === story.id);
      }

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
            <S.TasksLabelWrapper>
              <S.TasksLabel>Tasks:</S.TasksLabel>
              <PlusOutlined
                style={{ fontSize: 24, color: 'green' }}
                onClick={() => {
                  setNewTaskStoryId(story.id);
                  setIsAddTaskModalOpen(true);
                }}
              />
            </S.TasksLabelWrapper>
            {storyTasks && (
              <S.TasksWrapper>
                {storyTasks.map(({ id, name }) => (
                  <S.TaskWrapper key={id}>
                    <S.TaskLabel>{name}</S.TaskLabel>
                    <DeleteOutlined
                      style={{ fontSize: 24, color: 'red' }}
                      onClick={() => handleDeleteTask(id)}
                    />
                  </S.TaskWrapper>
                ))}
              </S.TasksWrapper>
            )}
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
            <S.StoriesHeading>Active project stories:</S.StoriesHeading>
            <PlusOutlined
              style={{ fontSize: 24, color: 'green' }}
              onClick={() => setIsAddStoryModalOpen(true)}
            />
          </S.HeadingWrapper>
          {activeProjectStories && (
            <>
              <S.StoriesWrapper>
                <S.StatusLabel>To do</S.StatusLabel>
                <S.Stories>{renderStories('todo')}</S.Stories>
              </S.StoriesWrapper>

              <S.StoriesWrapper>
                <S.StatusLabel>Doing</S.StatusLabel>
                <S.Stories>{renderStories('doing')}</S.Stories>
              </S.StoriesWrapper>

              <S.StoriesWrapper>
                <S.StatusLabel>Done</S.StatusLabel>
                <S.Stories>{renderStories('done')}</S.Stories>
              </S.StoriesWrapper>
            </>
          )}

          {editedStoryId && (
            <EditStory
              isModalOpen={isEditStoryModalOpen}
              setIsModalOpen={setIsEditStoryModalOpen}
              storyId={editedStoryId}
            />
          )}

          {newTaskStoryId && (
            <TaskForm
              isModalOpen={isAddTaskModalOpen}
              storyId={newTaskStoryId}
              setIsModalOpen={setIsAddTaskModalOpen}
            />
          )}

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
