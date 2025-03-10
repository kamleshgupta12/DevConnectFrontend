export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
  }) {
    return (
      <button
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center h-10 justify-center ${
          outline ? "border border-[#308d46] bg-transparent" : "bg-[#308d46]"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-white ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && "text-[#308d46]"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </button>
    )
  }