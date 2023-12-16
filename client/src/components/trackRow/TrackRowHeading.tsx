import { ClockCircleOutlined } from "@ant-design/icons";
import "./TrackRow.css";

const TrackRowHeading = ({ added_at }: { added_at?: boolean }) => {
  return (
    <div className="collection-heading grid-cols mb-2 border-b-[1px] p-2">
      <span>#</span>
      <span>Title</span>
      <span className="album-name">Album</span>
      <span className="date-added added-at-col">
        {added_at && "Date added"}
      </span>
      <span className="duration">
        <ClockCircleOutlined />
      </span>
    </div>
  );
};

export default TrackRowHeading;
