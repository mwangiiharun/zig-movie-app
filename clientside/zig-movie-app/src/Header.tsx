import React from 'react';

interface IProps {
  name?: string;
}

const Header: React.FC<IProps> = (props: IProps) => (
  <h1>Hello, {props.name}! Welcome to THE ZIG Coding Challenge.</h1>
);

Header.defaultProps = {
  name: 'world',
};

export default Header;