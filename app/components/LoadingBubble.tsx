import { LoaderPinwheel } from "lucide-react";

const LoadingBubble = () => {
    return (
        <div className="loading-bubble">
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>
    );
};

export default LoadingBubble;