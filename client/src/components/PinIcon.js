import React from "react";
import PlaceTwoTone from "@material-ui/icons/PlaceTwoTone";

export default ({ size, color, onPinClick }) => (
  <PlaceTwoTone
    onClick={onPinClick}
    style={{ fontSize: size, color }}
  />
);
