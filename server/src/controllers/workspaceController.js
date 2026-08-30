

const createWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;

        if(!name || !description) {
            
        }
        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        })
    }
}