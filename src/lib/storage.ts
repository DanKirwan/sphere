import get, { AccessorFunction } from 'ts-get';

const LOCAL_STORED_DATA = 'localStoredData';

class LocalSettingsData {
    distance: number = 10;
    maskPercentage: number = 5;
}

class LocalStoredData {
    settings: LocalSettingsData = new LocalSettingsData();
}

const isPrimitive = (v: any) => v === null || !(v instanceof Object || v instanceof Function);
const objectify = <T>(obj: T): any => {
    if (isPrimitive(obj)) return { value: obj };
    if (Array.isArray(obj)) return obj;
    const mapped = Object.entries(obj).map(([key, value]) => [key, objectify(value)]);
    return Object.fromEntries(mapped);
}
const unobjectify = <T>(obj: T): any => {
    if (Array.isArray(obj) || !obj) return obj;
    const mapped = Object.entries(obj).map(([key, value]) => value && value['value'] !== void 0 && isPrimitive(value['value']) ?
        [key, value['value']] :
        [key, Array.isArray(value) ? value : unobjectify(value)]
    );
    return Object.fromEntries(mapped);
}

class StorageWrapper {
    private localStoredData: LocalStoredData;

    constructor(private storage: Storage) {
        const lsd = storage.getItem(LOCAL_STORED_DATA);
        const data = { ...objectify(new LocalStoredData()), ...(lsd ? JSON.parse(lsd) : null) } as LocalStoredData;
        this.localStoredData = data;
    };
    get<R>(accessorFn: AccessorFunction<LocalStoredData, R>): R {
        const v: any = get(this.localStoredData, accessorFn);
        return unobjectify(v);
    }
    set<R>(accessorFn: AccessorFunction<LocalStoredData, R>, value: R) {
        const v: any = get(this.localStoredData, accessorFn);
        const keys = Object.keys(v);
        keys.forEach(k => delete v[k]);
        Object.assign(v, objectify(value));
        this.updateStorage();
    }
    private updateStorage() {
        this.storage.setItem(LOCAL_STORED_DATA, JSON.stringify(this.localStoredData));
    }
}

export const createLocalStoredData = () => new StorageWrapper(localStorage);

export const recordToIterable = <T extends string | number | symbol, U>(record: Record<T, U>) => Object.entries(record) as [T, U][];
