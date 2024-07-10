import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;

  > ul {
    flex: 1;

    &:last-of-type {
      justify-content: flex-end;
    }

    span {
      user-select: none;
    }
  }
`;
