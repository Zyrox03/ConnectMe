import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/authSlice.js";

const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    //   const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.auth.user.friends);
    const getFriends = async () => {
        const response = await fetch(
            `https://woozy-kindhearted-brie.glitch.me/users/${userId}/friends`,
            {
                method: "GET",
                // headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();

        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.length > 0 ? friends.map((friend) => (
                    <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath.path}
                        isPost={false}

                    />
                ))
                    :

                    <p>No friends added</p>
                }
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;