// components/DeleteCommentButton.js
import React from 'react';

const DeleteCommentButton = ({ commentId, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/controllers/comments/delete_comment.php?id=${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete comment');
            }
            console.log("Deleting comment with ID:", commentId);
            onDelete(commentId); // Mise à jour de la liste des commentaires
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete the comment.');
        }
    };

    return (
        <a
        href="#"
        className="flex px-3 py-2 gap-2 text-gray-800 hover:bg-socialBlue hover:text-white rounded-md transition-all transform hover:scale-105 hover:shadow-md"
        onClick={handleDelete}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
            </svg>
            Delete
        </a>
    );
};

export default DeleteCommentButton;
