import { useEffect, useState } from 'react';
import { Input, Button, Form, Modal } from 'antd';
import { rxjsStore } from '../../store/rxjsStore';
import { Project } from '../../types/project';
import ApiBridge from '../../classes/apiBridge';

import * as S from './EditProject.styled';

const { TextArea } = Input;

type FormValues = {
  name: string;
  description: string;
};

type EditProjectProps = {
  projectId: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const EditProject = ({
  projectId,
  isModalOpen = false,
  setIsModalOpen,
}: EditProjectProps) => {
  const [project, setProject] = useState<Project | null>(null);

  const handleSubmit = ({ name, description }: FormValues) => {
    const project = { id: projectId, name, description };

    ApiBridge.updateProject(project);

    setIsModalOpen(false);
  };

  useEffect(() => {
    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();
    const editedProject = existingStoreProjects.find(
      ({ id }) => id === projectId
    );

    if (!editedProject) {
      return;
    }

    setProject(editedProject);
  }, [projectId]);

  return (
    <Modal
      title="Edit Project"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      destroyOnClose
    >
      <S.Wrapper>
        {project && (
          <>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name:"
                name="name"
                initialValue={project.name}
                rules={[
                  {
                    required: true,
                    message: 'Please input project name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description:"
                name="description"
                initialValue={project.description}
                rules={[
                  {
                    required: true,
                    message: 'Please input project description!',
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
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

export default EditProject;
