import React from 'react';

export const VextronicLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 text-[var(--accent)]"
      >
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1 5h2v4h3l-4 5v-4H9v-5z" />
      </svg>
      <span className="text-xl font-bold text-[var(--text-primary)]">Vextronic AI</span>
  </div>
);


export const SendIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-6 h-6"}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const AttachmentIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className || "w-6 h-6"}
    >
        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0s.318.319.095.542l-7.379 7.379a2.25 2.25 0 003.182 3.182l5.25-5.25a.75.75 0 00-1.06-1.06l-5.25 5.25a.75.75 0 01-1.06 0l7.379-7.379a3.75 3.75 0 00-5.303-5.303l-10.5 10.5a2.25 2.25 0 003.182 3.182l10.5-10.5a.75.75 0 00-1.06-1.06l-10.5 10.5a.75.75 0 01-1.06 0l10.5-10.5a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
    </svg>
);


export const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className || "w-5 h-5"}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const BotIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className || "w-6 h-6"}
    >
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1 5h2v4h3l-4 5v-4H9v-5z" />
    </svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className || "w-6 h-6"}
    >
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export const UserIconWithCircle = ({ className }: { className?: string }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-slate-400 ${className}`}>
    <UserIcon className="w-5 h-5" />
  </div>
);

export const SunIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.59a.75.75 0 01-1.06-1.061l1.591-1.59a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 0l1.59 1.591a.75.75 0 01-1.06 1.06l-1.59-1.59a.75.75 0 010-1.061zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.894 16.202a.75.75 0 01-1.06-1.06l-1.59-1.591a.75.75 0 011.06-1.06l1.59 1.59a.75.75 0 010 1.061zM4.5 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM6.106 6.106a.75.75 0 011.06 0l1.591 1.59a.75.75 0 01-1.06 1.061L6.106 7.167a.75.75 0 010-1.06z" />
    </svg>
);

export const MoonIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.818 2.01-7.174 5.063-8.942a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
);

export const LanguageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M12.28 1.903a.75.75 0 01.753.034L22.06 7.25a.75.75 0 01.04 1.28l-8.5 6.13a.75.75 0 01-.848 0L4.252 8.53a.75.75 0 01.04-1.28l9.027-5.347zM3.5 9.336l8.5 6.13a.75.75 0 00.848 0l8.5-6.13v6.556a2.25 2.25 0 01-2.25 2.25H5.75A2.25 2.25 0 013.5 15.892V9.336z" clipRule="evenodd" />
        <path d="M12.657 14.873a.75.75 0 01-1.06 0l-1.025-1.025a.75.75 0 111.06-1.06l1.025 1.025a.75.75 0 010 1.06zM15.44 14.873a.75.75 0 01-1.061 0l-3.5-3.5a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06z" />
    </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const GenerateIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M16.5 3.75A2.25 2.25 0 0014.25 6H9.75a2.25 2.25 0 00-2.25 2.25v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75-.75h-4.5a.75.75 0 01-.75-.75V15a.75.75 0 00-1.5 0v1.5a2.25 2.25 0 002.25 2.25h4.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M20.25 6.375a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V7.125a.75.75 0 01.75-.75zM4.5 6.375a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V7.125a.75.75 0 01.75-.75z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M12.053 10.447a.75.75 0 011.06 0l1.5 1.5a.75.75 0 01-1.06 1.06l-.22-.22v2.365a.75.75 0 01-1.5 0v-2.365l-.22.22a.75.75 0 01-1.06-1.06l1.5-1.5z" clipRule="evenodd" />
    </svg>
  );
  
export const ExplainIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path d="M12.965 3.323c.348-.348.84-.523 1.332-.523s.984.175 1.332.523l1.846 1.846c.348.348.523.84.523 1.332s-.175.984-.523 1.332l-7.015 7.015a2.09 2.09 0 01-1.332.523H7.5a.75.75 0 01-.75-.75v-2.152a2.09 2.09 0 01.523-1.332l7.015-7.015zm.207 1.707L6.657 11.545v1.23h1.23l6.515-6.515-1.23-1.23z" />
      <path d="M5.625 15.75a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H5.625zM4.5 19.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" />
    </svg>
  );

export const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5A1.5 1.5 0 007.5 20.25h8.25a.75.75 0 010 1.5H7.5a3 3 0 01-3-3V5.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H7.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M19.06 11.47a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06L16.94 13.5H10.5a.75.75 0 010-1.5h6.44l-3.44-3.44a.75.75 0 011.06-1.06l4.5 4.5z" clipRule="evenodd" />
    </svg>
);

export const GoogleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className || "w-5 h-5"}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.657-11.303-8H6.306C9.656,35.663,16.318,40,24,40z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
