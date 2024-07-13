import { useEffect, useState } from 'react';
import { Input, Button, Form, Modal, Select } from 'antd';
import { rxjsStore } from '../../store/rxjsStore';

import * as S from './EditTask.styled';
import { Priority, State, Story } from '../../types/story';
import { User } from '../../types/user';
import { Task } from '../../types/task';
import ApiBridge from '../../classes/apiBridge';

const { TextArea } = Input;

const prioritySelectOptions = [
  { value: 'low', label: <span>Low</span> },
  { value: 'medium', label: <span>Medium</span> },
  { value: 'high', label: <span>High</span> },
];

const stateSelectOptions = [
  { value: 'todo', label: <span>To do</span> },
  { value: 'doing', label: <span>Doing</span> },
  { value: 'done', label: <span>Done</span> },
];

type FormValues = {
  assignedUserId?: number;
  name: string;
  description: string;
  estimatedTime: number;
  priority: Priority;
  state: State;
  storyId: number;
};

type EditTaskProps = {
  taskId: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const EditTask = ({
  taskId,
  isModalOpen = false,
  setIsModalOpen,
}: EditTaskProps) => {
  const [activeProjectId, setActiveProjectId] = useState<number>();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[] | null>();
  const [stories, setStories] = useState<Story[] | null>();

  const filteredUsers = users?.filter((user) => user.role !== 'admin');

  const ownerSelectOptions = filteredUsers?.map((user) => ({
    value: user.id,
    label: `${user.name} ${user.surname}`,
  }));

  const activeProjectStories = stories?.filter(
    (story) => story.projectId === activeProjectId
  );

  const storySelectOptions = activeProjectStories?.map((story) => ({
    value: story.id,
    label: story.name,
  }));

  const handleSubmit = (values: FormValues) => {
    const {
      assignedUserId,
      name,
      description,
      estimatedTime,
      priority,
      state,
      storyId,
    } = values;

    let newState: State = state;

    if (!state && assignedUserId) {
      newState = 'doing';
    }

    if (!state && !assignedUserId) {
      newState = 'todo';
    }

    const task: Task = {
      id: taskId,
      assignedUserId,
      name,
      description,
      estimatedTime,
      priority,
      state: newState || 'todo',
      storyId,
      startedAt: newState === 'doing' ? new Date(Date.now()) : null,
      finishedAt: newState === 'done' ? new Date(Date.now()) : undefined,
    };

    ApiBridge.updateTask(task);

    setIsModalOpen(false);
  };

  useEffect(() => {
    rxjsStore.getStoreTasks().subscribe((tasks) => {
      const editedTask = tasks.find(({ id }) => id === taskId);

      if (!editedTask) {
        return;
      }

      setTask(editedTask);
    });

    rxjsStore.getStoreActiveProject().subscribe((id) => {
      setActiveProjectId(id);
    });

    rxjsStore.getStoreUsers().subscribe((users) => {
      setUsers(users);
    });

    rxjsStore.getStoreStories().subscribe((stories) => {
      setStories(stories);
    });
  }, [taskId]);

  let createdAtDate, startedAtDate, finishedAtDate;

  if (task?.createdAt instanceof Date) {
    createdAtDate = null;
  } else {
    if (task?.createdAt) {
      createdAtDate = new Date(task.createdAt.seconds * 1000).toLocaleString();
    }
  }

  if (task?.startedAt instanceof Date) {
    startedAtDate = null;
  } else {
    if (task?.startedAt) {
      startedAtDate = new Date(task.startedAt.seconds * 1000).toLocaleString();
    }
  }

  if (task?.finishedAt instanceof Date) {
    finishedAtDate = null;
  } else {
    if (task?.finishedAt) {
      finishedAtDate = new Date(
        task.finishedAt.seconds * 1000
      ).toLocaleString();
    }
  }
  return (
    <Modal
      title="Edit Task"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      destroyOnClose
    >
      <S.Wrapper>
        {task && (
          <>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name:"
                name="name"
                initialValue={task.name}
                rules={[
                  {
                    required: true,
                    message: 'Please input task name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description:"
                name="description"
                initialValue={task.description}
                rules={[
                  {
                    required: true,
                    message: 'Please input task description!',
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              {storySelectOptions && (
                <Form.Item
                  label="Story:"
                  name="storyId"
                  initialValue={task.storyId}
                  rules={[
                    {
                      required: true,
                      message: 'Please select story!',
                    },
                  ]}
                >
                  <Select options={storySelectOptions} />
                </Form.Item>
              )}

              {task.state !== 'todo' && (
                <Form.Item
                  label="State:"
                  name="state"
                  initialValue={task.state || 'todo'}
                  rules={[
                    {
                      required: true,
                      message: 'Please select state!',
                    },
                  ]}
                >
                  <Select options={stateSelectOptions} />
                </Form.Item>
              )}

              <Form.Item
                label="Priority:"
                name="priority"
                initialValue={task.priority}
                rules={[
                  {
                    required: true,
                    message: 'Please select priority!',
                  },
                ]}
              >
                <Select options={prioritySelectOptions} />
              </Form.Item>
              <Form.Item
                label="Estimated time in days:"
                name="estimatedTime"
                initialValue={task.estimatedTime}
                rules={[
                  {
                    required: true,
                    message: 'Please select estimated time!',
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              {createdAtDate && (
                <Form.Item
                  label="Created at:"
                  name="createdAt"
                  initialValue={createdAtDate}
                >
                  <Input type="text" disabled />
                </Form.Item>
              )}

              {task.state !== 'todo' && startedAtDate ? (
                <Form.Item
                  label="Started at:"
                  name="startedAt"
                  initialValue={startedAtDate}
                >
                  <Input type="text" disabled />
                </Form.Item>
              ) : null}

              {finishedAtDate && (
                <Form.Item
                  label="Finished at:"
                  name="finishedAt"
                  initialValue={finishedAtDate}
                >
                  <Input type="text" disabled />
                </Form.Item>
              )}
              {ownerSelectOptions && (
                <Form.Item
                  label="Assigned user:"
                  name="assignedUserId"
                  initialValue={task.assignedUserId}
                  rules={[
                    {
                      required: true,
                      message: 'Please select assigned user!',
                    },
                  ]}
                >
                  <Select options={ownerSelectOptions} />
                </Form.Item>
              )}
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form>
          </>
        )}
      </S.Wrapper>
    </Modal>
  );
};

export default EditTask;
