import moment from "moment";
// calculate total duration of tracks
export default function sumTotalTracksDuration(
  arrayPlaylistTrackObj: SpotifyApi.PlaylistTrackObject[] | undefined,
  arrayTrackObjSimplified: SpotifyApi.TrackObjectSimplified[] | undefined,
) {
  if (arrayPlaylistTrackObj) {
    const totalTracksDuration = moment
      .utc(
        arrayPlaylistTrackObj?.reduce(
          (total, track) => total + track.track.duration_ms,
          0,
        ),
      )
      .format(
        moment
          .duration(
            arrayPlaylistTrackObj?.reduce(
              (total, track) => total + track.track.duration_ms,
              0,
            ),
          )
          .hours() >= 1
          ? "h [hours], m [minutes], s [seconds]"
          : "m [minutes], s [seconds]",
      );

    return totalTracksDuration;
  } else if (arrayTrackObjSimplified) {
    const totalTracksDuration = moment
      .utc(
        arrayTrackObjSimplified?.reduce(
          (total, track) => total + track.duration_ms,
          0,
        ),
      )
      .format(
        moment
          .duration(
            arrayTrackObjSimplified?.reduce(
              (total, track) => total + track.duration_ms,
              0,
            ),
          )
          .hours() >= 1
          ? "h [hours], m [minutes], s [seconds]"
          : "m [minutes], s [seconds]",
      );

    return totalTracksDuration;
  }
}
