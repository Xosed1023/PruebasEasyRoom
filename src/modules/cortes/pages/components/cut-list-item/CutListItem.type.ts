export interface CutListItemProps {
    title: string;
    value: number;
    onDetails: () => void;
    onDownload: () => void
    loading: boolean,
    setIsLoading: (v: boolean) => void
}