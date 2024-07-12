import { Input, Button, Form, Modal } from 'antd';
import { rxjsStore } from '../../store/rxjsStore';

import * as S from './ProjectFormStyled';
import { Project as ProjectType } from '../../types/project';
import Project from '../../classes/project';

const { TextArea } = Input;

type FormValues = {
  name: string;
  description: string;
};

type ProjectFormProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedProject: (project: ProjectType) => void;
};

const ProjectForm = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedProject,
}: ProjectFormProps) => {
  const handleSubmit = ({ name, description }: FormValues) => {
    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();

    const lastProjectId =
      existingStoreProjects[existingStoreProjects.length - 1]?.id;

    const newProjectId = lastProjectId ? lastProjectId + 1 : 1;

    const projectData = { id: newProjectId, name, description };

    new Project(newProjectId, name, description);

    rxjsStore.setStoreActiveProject(newProjectId);

    setSelectedProject(projectData);

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Add Project"
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
                message: 'Please input project name!',
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
                message: 'Please input project description!',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add project
          </Button>
        </Form>
      </S.Wrapper>
    </Modal>
  );
};

export default ProjectForm;
