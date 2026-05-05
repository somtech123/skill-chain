export default function CodeHexagon() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 680"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon — border only, fills with bg color */}
      <polygon
        points="340,60 595,200 595,480 340,620 85,480 85,200"
        style={{ fill: "var(--svg-bg)", stroke: "#6d28d9", strokeWidth: 6 }}
      />

      {/* Inner solid hexagon */}
      <polygon
        points="340,95 564,222 564,458 340,585 116,458 116,222"
        style={{ fill: "#6d28d9" }}
      />

      {/* </> text */}
      <text
        x="340"
        y="342"
        style={{
          fontFamily: "ui-monospace, 'Fira Code', monospace",
          fontSize: "120px",
          fontWeight: 700,
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: "var(--svg-code-text)",
        }}
      >
        {"</>"}
      </text>
    </svg>
  );
}
