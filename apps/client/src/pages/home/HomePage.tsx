import { Link as RouterLink } from "react-router";

const HomePage = () => {
  return (
    <ul>
      <li>
        <RouterLink to="/editor">Editor</RouterLink>
      </li>
      <li>
        <RouterLink to="/viewer">Viewer</RouterLink>
      </li>
    </ul>
  );
};

export { HomePage };
