import { Hash, HashedObject, MutableObject, MutationOp, Resources, Space, SpaceEntryPoint, SpaceInit } from '@hyper-hyper-space/core';
import React, { useContext, useState, useEffect } from 'react';


const PeerResources = React.createContext<Resources>(new Resources());
const PeerResourcesUpdater = React.createContext<React.Dispatch<React.SetStateAction<Resources>>>(() => { });

const usePeerResources: () => Resources = () => {
    return useContext(PeerResources);
}

const usePeerResourcesUpdater: () => React.Dispatch<React.SetStateAction<Resources>> = () => {
    return useContext(PeerResourcesUpdater);
} 

const useSpace = <T extends HashedObject>(init: SpaceInit, broadcast?: boolean) => {
    const resources = usePeerResources();

    const [entryPoint, setEntryPoint] = useState<HashedObject|undefined>(undefined);

    useEffect(() => {

        const space = new Space(init, resources);
        const doBroadcast = broadcast !== undefined? broadcast : init.wordCode !== undefined;
        let initialized = false;
        let destroyed = false;
        space.entryPoint.then(async (obj: HashedObject & SpaceEntryPoint) => {
            if (!destroyed) {

                if (doBroadcast) {
                    space.startBroadcast();
                }

                obj.setResources(resources);
                if (resources.store) {
                    await resources.store.save(obj);
                }
                obj.startSync();

                setEntryPoint(obj);

                initialized = true;
            }
            
        });

        return () => {
            destroyed = true;

            if (initialized) {
                if (doBroadcast) {
                    space.stopBroadcast();
                }

                space.getEntryPoint().then((obj: HashedObject & SpaceEntryPoint) => {
                    obj.stopSync();
                });
            }
            
        };
    }, [init, broadcast, resources]);

    return entryPoint as T|undefined;

};

class StateObject<T extends HashedObject> {

    value?: T;

    constructor(obj?: T) {
        this.value = obj;
    }
}

const useStateObjectByHash = <T extends HashedObject>(hash?: Hash) => {

    const resources = usePeerResources();
    const [stateObject, setSateObject] = useState<StateObject<T> | undefined> (undefined);

    useEffect(() => {

        let destroyed = false;
        let obj: T | undefined = undefined;

        let mutCallback = (mut: MutationOp) => {
            if (obj !== undefined) {
                setSateObject(new StateObject(obj));
            }
        };

        if (hash !== undefined) {
            resources.store?.load(hash).then((obj: HashedObject|undefined) => {
                if (obj !== undefined && obj instanceof MutableObject) {
                    
                    obj.watchForChanges(true);
                    obj.loadAllChanges().then(() => {
                        if (!destroyed) {
                            setSateObject(new StateObject(obj as any as T));
                            obj.addMutationCallback(mutCallback);    
                        }
                    });
                }
            });
        }


        return () => {

            destroyed = true;

            if (hash !== undefined && obj !== undefined && obj instanceof MutableObject) {
                obj.watchForChanges(false);
                obj.deleteMutationCallback(mutCallback);
            }  
        };
    }, [resources, hash]);

    return stateObject;

 };


const useStateObject = <T extends HashedObject>(objOrPromise?: T | Promise<T | undefined>) => {

    const init = objOrPromise instanceof HashedObject? objOrPromise : undefined;
    const [stateObject, setSateObject] = useState<StateObject<T> | undefined> (new StateObject(init));

    useEffect(() => {

        let prom: Promise<T | undefined> | undefined;

        if (objOrPromise instanceof Promise) {
            prom = objOrPromise;
        } else if (objOrPromise !== undefined) {
            prom = Promise.resolve(objOrPromise);
        } else {
            prom = undefined;
        }

        let loadedObj: T | undefined;

        let destroyed = false;
        let mutCallback = (mut: MutationOp) => {
            setSateObject(new StateObject(loadedObj));
        }

        

        prom?.then(obj => {

            loadedObj = obj;

            if (obj !== undefined && obj instanceof MutableObject) {
                
                obj.watchForChanges(true);
                obj.loadAllChanges().then(() => {
                    if (!destroyed) {
                        console.log('sate loaded for ' + obj.hash() + '!');
                        setSateObject(new StateObject(obj));
                        obj.addMutationCallback(mutCallback);    
                    }
                });
            }
    
        });


        return () => {

            destroyed = true;

            if (loadedObj !== undefined && loadedObj instanceof MutableObject) {
                loadedObj.watchForChanges(false);
                loadedObj.deleteMutationCallback(mutCallback);
            }  
        };
    }, [objOrPromise]);

    return stateObject;

 };


export { PeerResources, usePeerResources, PeerResourcesUpdater, usePeerResourcesUpdater, useSpace, useStateObject, useStateObjectByHash };