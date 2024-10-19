export const renderPollImage = ({
  title,
  options,
}: {
  title: string;
  options: any[];
}) => {
  return (
    <div
      style={{
        width: "600px",
        height: "200px",
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
        {"Who's Faster"}
      </h2>
      {options.map((option, index) => (
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
            {1}.
          </div>
          <div
            style={{
              flex: 1,
              height: "40px",
              backgroundColor: index === 0 ? "#2C4A3E" : "#333333",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              position: "relative",
            }}
          >
            {"This are options"}
            <span
              style={{
                position: "absolute",
                right: "20px",
              }}
            >
              {0 === 0 ? "96%" : "4%"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
