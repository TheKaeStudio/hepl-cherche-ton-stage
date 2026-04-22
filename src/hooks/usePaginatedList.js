import { useState, useEffect, useCallback, useRef } from "react";

export function usePaginatedList(fetchFn, pageSize = 20) {
    const [items, setItems]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore]         = useState(false);
    const [total, setTotal]             = useState(0);
    const pageRef  = useRef(0);
    const fetchRef = useRef(fetchFn);
    fetchRef.current = fetchFn;

    const reset = useCallback(() => {
        setLoading(true);
        setItems([]);
        pageRef.current = 0;
        fetchRef.current({ page: 1, limit: pageSize })
            .then(({ items: data, total: t, hasMore: more }) => {
                setItems(data);
                setTotal(t);
                setHasMore(more);
                pageRef.current = 1;
            })
            .finally(() => setLoading(false));
    }, [pageSize]);

    useEffect(() => { reset(); }, [reset]);

    const loadMore = useCallback(() => {
        const nextPage = pageRef.current + 1;
        setLoadingMore(true);
        fetchRef.current({ page: nextPage, limit: pageSize })
            .then(({ items: data, total: t, hasMore: more }) => {
                setItems((prev) => [...prev, ...data]);
                setTotal(t);
                setHasMore(more);
                pageRef.current = nextPage;
            })
            .finally(() => setLoadingMore(false));
    }, [pageSize]);

    return { items, loading, loadingMore, hasMore, total, loadMore, reset, setItems };
}
