// client/src/components/user/ProfileStatus.jsx
const ProfileStatus = ({ status }) => {
  const getStatusColor = () => {
    return status === "complete" ? "bg-green-100" : "bg-yellow-100";
  };

  const getStatusText = () => {
    return status === "complete"
      ? "Profile Complete"
      : "Profile Incomplete - Please complete your profile";
  };

  return (
    <div className={`${getStatusColor()} rounded-md p-4 mb-6`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {status === "complete" ? (
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium ${
              status === "complete" ? "text-green-800" : "text-yellow-800"
            }`}>
            Profile Status
          </h3>
          <div
            className={`mt-2 text-sm ${
              status === "complete" ? "text-green-700" : "text-yellow-700"
            }`}>
            <p>{getStatusText()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatus;
