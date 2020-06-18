import React, { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../../App";
import { GenericBtn } from "../../lib";
import { Colors } from "../../../styles/colors";
import Icons from "../../icons";
import styled from "styled-components";
import profile_src from "../../../images/profile.png";
import { useAsync } from "../../../hooks/useAsync";
import { useCreateTweet } from "../../../utils/tweets";
import useModal from "../../../hooks/useModal";
import Toast from "../../toast";
import { useAuth } from "../../../context/authContext";

const TweetWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 15px;
`;

const TweetForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 0.5s ease;
  opacity: ${({ isUploading }) => (isUploading ? `.33` : `1`)};
`;

const TweetInputWrapper = styled.div`
  display: flex;
`;

const MediaContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 0;
`;

const MediaContentOverflow = styled.div`
  position: relative;
`;

const MediaContentInner = styled.div`
  padding-bottom: 56.25%;
  width: 100%;
`;

const MediaImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  width: 100%;
  height: 100%;
`;

const MediaContentPositioner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const MediaContentImgWrapper = styled.div`
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  flex-grow: 1;
  position: relative;
  &:last-child {
    margin-right: 0;
  }
`;

const MediaImgDelete = styled.div`
  position: absolute;
  z-index: 10;
  top: 5px;
  left: 5px;
  cursor: pointer;
  min-width: 30px;
  min-height: 30px;
  display: ${({ isUploading }) => (isUploading ? `none` : `flex`)};
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.66);
  & svg {
    fill: white;
    width: 19.75px;
    height: 19.75px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.33);
    & svg {
      fill: rgba(255, 255, 255, 0.77);
    }
  }
`;

const MediaContentImgInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const MediaContentImgAdjust = styled.div`
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
`;

const MediaContentImgOverflow = styled.div`
  display: flex;
  flex-basis: auto;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const MediaContentBG = styled.div`
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  border-radius: 14px;
`;

const MediaContentImg = styled.img`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const UserImg = styled.img`
  border-radius: 50%;
  width: 49px;
  height: 49px;
`;

const TweetInput = styled.input`
  width: 100%;
  font-size: 19px;
  border: 0;
  outline: 0;
  padding: 10px;
`;

const MediaInputWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: opacity 0.1s ease;
  opacity: ${({ isUploading }) => (isUploading ? `0` : `1`)};
`;

const MediaInnerWrapper = styled.label`
  display: flex;
  align-items: center;
`;

const MediaImg = styled.div`
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${Colors.hover};
  }

  & svg {
    width: 100%;
    fill: ${Colors.primary};
  }
`;

const MediaPolls = styled.div`
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${Colors.hover};
  }

  & svg {
    width: 100%;
    fill: ${Colors.primary};
  }
`;

// const TweetSubmit = styled.button`
//   min-height: 40px;
//   cursor: pointer;

//   border-radius: 999px;
//   padding: 0 20px;
//   border: 0;
//   outline: 0;
//   background: ${Colors.primary};
//   color: white;
//   font-size: 16px;
//   font-family: inherit;

//   &:hover {
//     background: rgb(26, 145, 218);
//   }
// `;

export function CreateTweetForm({
  loggedInUserId,
  loggedInUserName,
  isModal,
  closeModal,
  onSubmit,
  tweetStatus,
  parentTweetId,
  placeholder = "What's happening?",
}) {
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewsLoading, setPreviewsLoading] = useState(false);

  useEffect(() => {
    if (!selectedFiles) {
      setSelectedPreviews([]);
      return;
    }

    let imageUrls = [];
    selectedFiles.map((file) => {
      imageUrls.push(URL.createObjectURL(file));
    });

    setSelectedPreviews(imageUrls);
  }, [selectedFiles]);

  useEffect(() => {
    if (tweetStatus === "loading") {
      setUploadLoading(true);
    }
    if (tweetStatus === "success") {
      setUploadLoading(false);
      setValue("");
      setSelectedPreviews([]);
      setSelectedFiles([]);
      if (isModal) {
        closeModal();
      }
    }
  }, [tweetStatus]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    // for (let key of Object.keys(selectedFiles)) {
    console.log(selectedFiles);
    if (selectedFiles.length > 0) {
      selectedFiles.map((file) => {
        data.append("images", file);
      });
    }
    if (value) {
      data.append("content", value);
    }
    data.append("authorId", loggedInUserId);
    if (parentTweetId) {
      data.append("parent", parentTweetId);
    }
    data.append("authorUserName", loggedInUserName);

    onSubmit(data);
  };

  const handleRemovePreview = (previewUrl) => {
    setSelectedPreviews((old) => old.filter((item) => item !== previewUrl));
  };

  const handleFileSelect = (e) => {
    // e.preventDefault();
    if (!e.target.files || e.target.files < 0) {
      setSelectedFiles([]);
      return;
    }
    const tempFileList = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...tempFileList]);
  };

  return (
    <TweetForm onSubmit={handleFormSubmit} isUploading={uploadLoading}>
      <TweetInputWrapper>
        <TweetInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
          placeholder={placeholder}
        />
      </TweetInputWrapper>

      {selectedPreviews.length > 0 ? (
        <MediaContentWrapper>
          <MediaContentOverflow>
            <MediaContentInner />
            <MediaContentPositioner>
              <MediaImgContainer>
                <MediaContentImgInner>
                  <MediaContentImgAdjust>
                    <MediaContentImgOverflow>
                      {selectedPreviews.map((previewUrl) => (
                        <MediaContentImgWrapper>
                          <MediaImgDelete
                            isUploading={uploadLoading}
                            onClick={() => {
                              handleRemovePreview(previewUrl);
                            }}
                          >
                            {Icons.close}
                          </MediaImgDelete>
                          <MediaContentBG url={previewUrl} />
                          <MediaContentImg
                            src={previewUrl}
                            alt="image upload"
                          />
                        </MediaContentImgWrapper>
                      ))}
                    </MediaContentImgOverflow>
                  </MediaContentImgAdjust>
                </MediaContentImgInner>
              </MediaImgContainer>
            </MediaContentPositioner>
          </MediaContentOverflow>
        </MediaContentWrapper>
      ) : null}
      {!uploadLoading ? (
        <MediaInputWrapper isUploading={uploadLoading}>
          <MediaInnerWrapper>
            <input hidden type="file" onChange={handleFileSelect} multiple />
            <MediaImg>{Icons.img}</MediaImg>
          </MediaInnerWrapper>
          <GenericBtn type="submit" disabled={!value && !selectedFiles}>
            Tweet
          </GenericBtn>
        </MediaInputWrapper>
      ) : null}
    </TweetForm>
  );
}

const NewTweet = ({ parent, isModal, closeNewTweet, showSuccessToast }) => {
  // const { state } = useContext(AuthContext);
  // const { isLoading, isError, error, run, reset } = useAsync();
  const { user } = useAuth();
  const loggedInUserId = user.id;
  const loggedInUserName = user.userName;
  const [
    createTweet,
    { status: tweetStatus, data: tweetData, error: tweetError },
  ] = useCreateTweet();

  // const [tweetValue, setTweetValue] = useState("");
  // const [tweetResponse, setTweetResponse] = useState(null);
  useEffect(() => {
    if (tweetStatus === "success") {
      if (closeNewTweet) {
        closeNewTweet();
      }
      console.log(tweetData);
      showSuccessToast(`/${loggedInUserName}/status/${tweetData._id}`);

      // if (showSuccessToast) {
      //   console.log(messageData);
      //   showSuccessToast(messageData.conversationId);
      // } else {
      //   history.push(`/messages/${messageData.conversationId}`);
      // }
      // closeModal();
    }
  }, [tweetStatus]);

  // function handleSubmit(e) {
  //   e.preventDefault();

  //   const tweetData = {
  //     author: `${user.id}`,
  //     content: `${tweetValue}`,
  //     parent: parent ? `${parent}` : null,
  //   };

  //   // if (isError) {
  //   //   reset();
  //   // } else {
  //   //   run(handleAddClick({ tweetData: tweetData }));
  //   // }

  //   // handleAddClick({ tweetData: tweetData });
  //   // if (isError) {
  //   //   reset();
  //   // } else {
  //   //   run();
  //   // }
  // }

  return (
    <>
      <TweetWrapper>
        <UserImg src={profile_src} alt="User Image" />
        <CreateTweetForm
          loggedInUserId={loggedInUserId}
          onSubmit={createTweet}
          tweetStatus={tweetStatus}
          loggedInUserName={loggedInUserName}
        />
      </TweetWrapper>
    </>
  );
};

export default NewTweet;
