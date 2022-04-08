class TableManager {
    constructor(tableBody, rowRef) {
        /* Fast and easy adds items to a table
        * Documentation: ...js/_common/_table-manager-documentation.txt
        */
        this.$ = tableBody;
        this.$rt = rowRef.clone();
    }
    add(row) {
        if (typeof row == 'object') {
            let $toAdd = this.$rt.clone();
            let $cells = $toAdd.children('td');

            if (row instanceof Array) {
                for (let i of range(row.length)) {
                    if (!(i in $cells)) continue;
                    $($cells[i]).html(row[i]);
                }
            } else {
                for (let key in row) {
                    $cells.bem([{ m: key }]).html(row[key]);
                }
            }
            this.$.append($toAdd);
        }
    }
}

class StorageManager {
    constructor(storage, readonly = false, u = false) {
        /* Fast and easy manage localStorage and sessionStorage
        * Documentation: ...js/_common/_storage-manager-documentation.txt
        */
        if (![localStorage, sessionStorage].includes(storage)) throw new ReferenceError(`Unknown storage ${storage}`);

        this.storage = storage;
        this.readonly = readonly;
        this.u = u;
    }
    has(key, emp = true) {
        let temp = this.get(key);
        return temp === '' && emp ? true : !!temp;
    }
    get(key) {
        return this.storage.getItem(key);
    }
    every(type) {
        return (Object[ ['keys', 'values', 'entries'][type] ] || (() => {}))(this.obj()) || false;
    }
    set(key, val, u = this.u) {
        if (!u && this.u || this.readonly) return false;
        if (u && this.has(key)) return false;

        this.storage.setItem(key, val);
        return true;
    }
    reserve(key) {
        return this.set(key, '', true);
    }
    del(key, keepKey = false) {
        if (!this.has(key) || this.readonly) return false;
        if (keepKey) return this.set(key, '');

        this.storage.removeItem(key);
        return true;
    }
    clearAll() {
        if (this.readonly) return false;

        this.storage.clear();
        return true;
    }
    obj() {
        return Object.assign({}, this.storage);
    }
}
