import { Input, Select, Button, Form, Modal } from 'antd';
import * as S from './StoryFormStyled';
import { User } from '../../types/user';
import { rxjsStore } from '../../store/rxjsStore';
import { useEffect, useState } from 'react';
import { Priority, State } from '../../types/story';
import Story from '../../classes/story';

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

type StoryFormProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const StoryForm = ({ isModalOpen, setIsModalOpen }: StoryFormProps) => {
  const [users, setUsers] = useState<User[] | null>();

  const ownerSelectOptions = users?.map((user) => ({
    value: user.id,
    label: `${user.name} ${user.surname}`,
  }));

  useEffect(() => {
    rxjsStore.getStoreUsers().subscribe((users) => {
      setUsers(users);
    });
  }, []);

  const handleSubmit = ({
    name,
    description,
    priority,
    ownerId,
    state,
  }: FormValues) => {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    const activeProjectId = rxjsStore.getStoreActiveProject().getValue();

    const lastStoryId =
      existingStoreStories[existingStoreStories.length - 1]?.id;

    const newStoryId = lastStoryId ? lastStoryId + 1 : 1;

    new Story(
      newStoryId,
      new Date(Date.now()),
      description,
      ownerId,
      name,
      priority,
      activeProjectId,
      state
    );

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Add Story"
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
                message: 'Please input story name!',
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
                message: 'Please input story description!',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
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
            label="State:"
            name="state"
            initialValue={'todo'}
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
              initialValue={ownerSelectOptions[0]?.value}
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
            Add story
          </Button>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default StoryForm;
