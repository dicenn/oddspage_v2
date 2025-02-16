export const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center h-screen text-red-600">
    <div className="text-xl">{message}</div>
  </div>
);