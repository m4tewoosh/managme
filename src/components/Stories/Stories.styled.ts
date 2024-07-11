import styled from 'styled-components';

export const Wrapper = styled.div`
  > div {
    width: 100%;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin: 32px 0;
`;

export const StoriesHeading = styled.h3`
  font-weight: 600;
`;

export const StoriesWrapper = styled.div``;

export const Stories = styled.div``;

export const StatusLabel = styled.p`
  font-weight: 600;
`;

export const TasksWrapper = styled.div`
  margin-left: 16px;
`;

export const TasksLabelWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export const TasksLabel = styled.p`
  font-weight: 600;
`;

export const TaskLabel = styled.p`
  font-weight: 400;
`;

export const StoryWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export const TaskWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

export const KanbanWrapper = styled.div`
  display: flex;
  gap: 48px;

  > .ant-card {
    min-width: 320px;
  }
`;
