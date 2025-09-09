import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="flex-1 py-12 px-5 flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-premium"></div>
        </div>
    );
};

export default ResetPassword;