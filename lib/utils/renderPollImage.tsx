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
        width: "600px",
        height: "500px",
        backgroundColor: "#21252B",
        fontFamily: "Inter, sans-serif",
        color: "#F8F8F8",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
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
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "20px",
                marginRight: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {index + 1}.
            </div>
            <div
              style={{
                flex: 1,
                height: "40px",
                backgroundColor: "#333333",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${percentage}%`,
                  backgroundColor: "#2C4A3E",
                  zIndex: 1,
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>
                {option.optionText}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: "20px",
                  zIndex: 2,
                }}
              >
                {`${percentage}%`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
