import React from "react";
import {HashLoader} from 'react-spinners'
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween.jsx";
  import Dropzone from "react-dropzone";
  import UserImage from "../../components/UserImage.jsx";
  import WidgetWrapper from "../../components/WidgetWrapper.jsx";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "../../state/authSlice.js";
  import { useNavigate } from "react-router-dom";

  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.auth.user);
    // const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
  
    const handlePost = async () => {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("userID", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picturePath", image);
      }
  
      const response = await fetch(`https://woozy-kindhearted-brie.glitch.me/posts`, {
        method: "POST",
        body: formData,
      });
      setIsLoading(false)

      
      const data = await response.json();
      dispatch(setPosts({ posts : data }));
      setImage(null);
      setPost("");
      navigate(`/home`)
    };
  
    return (
      <WidgetWrapper className={isLoading ? 'loading': ''}>
    <HashLoader cssOverride={{ position: 'absolute',zIndex:'999', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} color="#36D7B7" loading={isLoading} />

        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: '100%',
              backgroundColor: palette.neutral.light,
              borderRadius: '2rem',
              padding: '1rem 2rem',
              whiteSpace: 'pre-wrap', // allow wrapping of long words
              wordWrap: 'break-word', // allow wrapping of long words
              overflowWrap: 'break-word', // allow wrapping of long words
              resize: 'vertical', // enable vertical resizing
            }}
            multiline={true}
            rows={2}
          />
        </FlexBetween>
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <Typography>Add Image Here</Typography>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
  
        <Divider sx={{ margin: "1.25rem 0" }} />
  
        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>
  
          {isNonMobileScreens ? (
            <>
              {/* <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Clip</Typography>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
              </FlexBetween> */}
            </>
          ) : (
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          )}
  
          <Button
            disabled={!post || post.trim() === ''}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
            
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;