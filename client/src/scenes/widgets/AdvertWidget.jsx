import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";

const AdvertWidget = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Sponsored
                </Typography>
                {/* <Typography color={medium}>Create Ad</Typography> */}
            </FlexBetween>
            <img
                width="100%"
                height="auto"
                alt="advert"
                src="https://res.cloudinary.com/duh30yscb/image/upload/v1680862809/SocialMedia/wmqwciwj8np3hjgq2pwa.jpg"
                style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <FlexBetween>
                <Typography color={main}>The FitClub</Typography>
                {/* <Typography color={medium}>mikacosmetics.com</Typography> */}
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">
            In here we will help you to shape and build your ideal body and live up your life to fullest
            </Typography>
        </WidgetWrapper>
    );
};

export default AdvertWidget;