type ConfirmDialogProps = {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void
}

export default function ConfirmDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {
    if (!open) return null;

    const handleYesBtn = () => {
        onConfirm();
        onClose();
    }

    const handleNoBtn = () => {
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[1000] flex justify-center items-center">
            <div className="p-2 w-56 max-h-fit bg-white rounded-md shadow-md">
                <p>Are you sure you want to perform this action?</p>
                <div className="mt-3 flex justify-around items-center">
                    <button className="px-2 bg-red-400 rounded-md cursor-pointer hover:font-medium" type="button" onClick={handleYesBtn}>Yes</button>
                    <button className="px-2 bg-gray-300 rounded-md cursor-pointer hover:font-medium" type="button" onClick={handleNoBtn}>No</button>
                </div>
            </div>
        </div>
    );
}