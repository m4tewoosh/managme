import { useEffect, useState } from 'react';
import { Input, Button, Form, Modal, Select } from 'antd';
import { rxjsStore } from '../../store/rxjsStore';

import * as S from './EditStory.styled';
import { Priority, State, Story } from '../../types/story';
import { User } from '../../types/user';
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
  name: string;
  description: string;
  priority: Priority;
  ownerId: number;
  state: State;
};

type EditStoryProps = {
  storyId: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const EditStory = ({
  storyId,
  isModalOpen = false,
  setIsModalOpen,
}: EditStoryProps) => {
  const [story, setStory] = useState<Story | null>(null);
  const [users, setUsers] = useState<User[] | null>();

  const ownerSelectOptions = users?.map((user) => ({
    value: user.id,
    label: `${user.name} ${user.surname}`,
  }));

  const handleSubmit = ({
    name,
    description,
    priority,
    ownerId,
    state,
  }: FormValues) => {
    const story = { id: storyId, name, description, priority, ownerId, state };

    ApiBridge.updateStory(story);

    setIsModalOpen(false);
  };

  useEffect(() => {
    rxjsStore.getStoreStories().subscribe((stories) => {
      const editedStory = stories.find(({ id }) => id === storyId);

      if (!editedStory) {
        return;
      }

      setStory(editedStory);
    });

    rxjsStore.getStoreUsers().subscribe((users) => {
      setUsers(users);
    });
  }, [storyId]);

  return (
    <Modal
      title="Edit Story"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      destroyOnClose
    >
      <S.Wrapper>
        {story && (
          <>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name:"
                name="name"
                initialValue={story.name}
                rules={[
                  {
                    required: true,
                    message: 'Please input story name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description:"
                name="description"
                initialValue={story.description}
                rules={[
                  {
                    required: true,
                    message: 'Please input story description!',
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Priority:"
                name="priority"
                initialValue={story.priority}
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
                label="State:"
                name="state"
                initialValue={story.state}
                rules={[
                  {
                    required: true,
                    message: 'Please select state!',
                  },
                ]}
              >
                <Select options={stateSelectOptions} />
              </Form.Item>
              {ownerSelectOptions && (
                <Form.Item
                  label="Owner:"
                  name="ownerId"
                  initialValue={story.ownerId}
                  rules={[
                    {
                      required: true,
                      message: 'Please select owner!',
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

export default EditStory;
