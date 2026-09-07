import { getInitials } from "./getInitials";

function Avatar({ user }) {
  return (
    <>
        {user?.avatar 
                        ? (
                        <img 
                            src={user?.avatar} 
                            alt="Profile"
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) 
                      : (
                        getInitials(user?.name || "?")
                      )
                    }
    </>
  )
}

export default Avatar;