export default function withConditionalRendering(WrappedComponent) {
  return function ConditionalComponent({ route, ...otherProps }) {
    if (route === "/login") {
      return null;
    }

    return <WrappedComponent {...otherProps} />;
  };
}
