export const renderPollImage = ({
  title,
  options,
}: {
  title: string;
  options: PollOption[];
}) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#1E1E1E",
        color: "#FFFFFF",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "left",
          color: "white",
        }}
      >
        {title}
      </h2>
      {options.map((option, index) => {
        const percentage = calculatePercentage(option.votes);
        return (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <span style={{ marginRight: "10px", color: "#6366F1" }}>▶</span>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {option.optionText}
              </span>
            </div>
            <div
              style={{
                height: "30px",
                backgroundColor: "#333333",
                borderRadius: "15px",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percentage}%`,
                  backgroundColor: "#6366F1",
                  borderRadius: "15px",
                  transition: "width 0.5s ease-out",
                  display: "flex",
                  flexDirection: "column",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {Math.round(option.votes)} votes
                </span>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#888888",
          display: "flex",
          flexDirection: "column",
        }}
      >
        Total votes: {totalVotes}
      </div>
    </div>
  );
};
