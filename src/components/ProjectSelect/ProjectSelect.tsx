import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { rxjsStore } from '../../store/rxjsStore';
import { Project } from '../../types/project';

import * as S from './ProjectSelect.styled';
import EditProject from '../EditProject/EditProject';
import ProjectForm from '../ProjectForm/ProjectForm';

const ProjectSelect = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const projectSelectOptions = projects?.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const handleDeleteActiveProject = () => {
    if (!projects) {
      return;
    }

    const activeProjectId = rxjsStore.getStoreActiveProject().getValue();

    const activeProjectStories = rxjsStore.getStoreStories().getValue();

    if (activeProjectStories) {
      const filteredStories = [...activeProjectStories].filter(
        (story) => story.projectId !== activeProjectId
      );
      rxjsStore.setStoreStories(filteredStories);
    }

    const filteredProjects = [...projects].filter(
      ({ id }) => id !== activeProjectId
    );

    if (filteredProjects.length) {
      rxjsStore.setStoreActiveProject(filteredProjects[0].id);
    }

    rxjsStore.setStoreProjects(filteredProjects);
  };

  useEffect(() => {
    rxjsStore.getStoreProjects().subscribe((projects) => {
      if (!projects) {
        return;
      }

      setProjects(projects);
      setSelectedProject(projects[0]);
    });
  }, []);

  return (
    <S.Wrapper>
      {projects && (
        <>
          <S.ProjectLabel>Active project:</S.ProjectLabel>
          <S.SelectWrapper>
            {projectSelectOptions && (
              <Select
                value={selectedProject?.id}
                onSelect={(value): void => {
                  rxjsStore.setStoreActiveProject(Number(value));

                  const selectedProject = projects.find(
                    ({ id }) => id === Number(value)
                  );

                  if (!selectedProject) {
                    return;
                  }

                  setSelectedProject(selectedProject);
                }}
                options={projectSelectOptions}
              />
            )}
            {projects.length > 0 && (
              <>
                <DeleteOutlined
                  style={{ fontSize: 24, color: 'red' }}
                  onClick={handleDeleteActiveProject}
                />
                <EditOutlined
                  style={{ fontSize: 24, color: 'blue' }}
                  onClick={() => setIsEditModalOpen(true)}
                />
              </>
            )}
            <PlusOutlined
              style={{ fontSize: 24, color: 'green' }}
              onClick={() => setIsProjectModalOpen(true)}
            />
          </S.SelectWrapper>
          {selectedProject && (
            <>
              <S.ProjectLabel>Project description:</S.ProjectLabel>
              <p>{selectedProject.description}</p>
            </>
          )}

          <EditProject
            isModalOpen={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
            projectId={rxjsStore.getStoreActiveProject().getValue()}
          />

          <ProjectForm
            isModalOpen={isProjectModalOpen}
            setIsModalOpen={setIsProjectModalOpen}
          />
        </>
      )}
    </S.Wrapper>
  );
};

export default ProjectSelect;
