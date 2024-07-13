import { useEffect, useState } from 'react';
import { Card, Select, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { rxjsStore } from '../../store/rxjsStore';
import { Project } from '../../types/project';

import * as S from './ProjectSelect.styled';
import EditProject from '../EditProject/EditProject';
import ProjectForm from '../ProjectForm/ProjectForm';
import ApiBridge from '../../classes/apiBridge';

const ProjectSelect = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleDeleteActiveProject = () => {
    if (!projects) {
      return;
    }

    const activeProjectId = rxjsStore.getStoreActiveProject().getValue();

    const filteredProjects = [...projects].filter(
      ({ id }) => id !== activeProjectId
    );

    if (filteredProjects.length) {
      rxjsStore.setStoreActiveProject(filteredProjects[0].id);
    }

    ApiBridge.deleteProject(activeProjectId);
    rxjsStore.setStoreProjects(filteredProjects);

    const activeProjectStories = rxjsStore.getStoreStories().getValue();

    if (activeProjectStories) {
      const filteredStories = [...activeProjectStories].filter(
        (story) => story.projectId !== activeProjectId
      );
      rxjsStore.setStoreStories(filteredStories);
    }
  };

  useEffect(() => {
    rxjsStore.getStoreProjects().subscribe((projects) => {
      if (!projects) {
        return;
      }

      setProjects(projects);

      if (projects) {
        const selectedProject = projects!.find(
          (project) =>
            project.id === rxjsStore.getStoreActiveProject().getValue()
        );

        setSelectedProject(selectedProject || projects[0]);
      }
    });
  }, []);

  const projectSelectOptions = projects?.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <S.Wrapper>
      {projects && (
        <Card title="Active project">
          <S.SelectWrapper>
            {projectSelectOptions && (
              <Select
                defaultValue={projects[0].id}
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
                  style={{ fontSize: 24, color: '#ff4d4f' }}
                  onClick={handleDeleteActiveProject}
                />
                <EditOutlined
                  style={{ fontSize: 24, color: '#69b1ff' }}
                  onClick={() => setIsEditModalOpen(true)}
                />
              </>
            )}
            <PlusOutlined
              style={{ fontSize: 24, color: '#73d13d' }}
              onClick={() => setIsProjectModalOpen(true)}
            />
          </S.SelectWrapper>
          {selectedProject && (
            <S.DescriptionWrapper>
              <Typography>Description:</Typography>
              <p>{selectedProject.description}</p>
            </S.DescriptionWrapper>
          )}

          <EditProject
            isModalOpen={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
            projectId={rxjsStore.getStoreActiveProject().getValue()}
          />

          <ProjectForm
            isModalOpen={isProjectModalOpen}
            setIsModalOpen={setIsProjectModalOpen}
            setSelectedProject={setSelectedProject}
          />
        </Card>
      )}
    </S.Wrapper>
  );
};

export default ProjectSelect;
