import { Input, Button, Form, Modal, Select } from 'antd';
import { rxjsStore } from '../../store/rxjsStore';

import * as S from './TaskFormStyled';
import { Priority, Story } from '../../types/story';
import Task from '../../classes/task';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

const prioritySelectOptions = [
  { value: 'low', label: <span>Low</span> },
  { value: 'medium', label: <span>Medium</span> },
  { value: 'high', label: <span>High</span> },
];

type FormValues = {
  name: string;
  description: string;
  priority: Priority;
  estimatedTime: number;
  storyId: number;
};

type TaskFormProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const TaskForm = ({ isModalOpen, setIsModalOpen }: TaskFormProps) => {
  const [activeProjectId, setActiveProjectId] = useState<number>();
  const [stories, setStories] = useState<Story[] | null>();

  const handleSubmit = ({
    name,
    description,
    estimatedTime,
    priority,
    storyId,
  }: FormValues) => {
    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();

    const lastTaskId = existingStoreTasks[existingStoreTasks.length - 1]?.id;

    const newTaskId = lastTaskId ? lastTaskId + 1 : 1;

    new Task(
      newTaskId,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      'todo',
      new Date(Date.now())
    );

    setIsModalOpen(false);
  };

  const activeProjectStories = stories?.filter(
    (story) => story.projectId === activeProjectId
  );

  const storySelectOptions = activeProjectStories?.map((story) => ({
    value: story.id,
    label: story.name,
  }));

  useEffect(() => {
    rxjsStore.getStoreActiveProject().subscribe((id) => {
      setActiveProjectId(id);
    });

    rxjsStore.getStoreStories().subscribe((stories) => {
      setStories(stories);
    });
  }, []);

  return (
    <Modal
      title="Add Task"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      destroyOnClose
    >
      <S.Wrapper>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name:"
            name="name"
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
              initialValue={storySelectOptions[0]?.value}
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

          <Form.Item
            label="Priority:"
            name="priority"
            initialValue={'low'}
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
            rules={[
              {
                required: true,
                message: 'Please input estimated time!',
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add task
          </Button>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default TaskForm;
