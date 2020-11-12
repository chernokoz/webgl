import * as THREE from "three-full";
import car_file from "../dist/src/resources/RetroRacerOrangeRotated.obj";
import {warn} from "three-full/sources/polyfills";
import * as mainjs from "./ViewArea.jsx";
import {inner_size, mesh_size} from "./ViewArea.jsx";

let instance = null;

export class Map2D {

    constructor(geometry, scene) {

        let loader = new THREE.OBJLoader();

        this.car = loader.parse(car_file);
        this.car.traverse( (child) => {
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshStandardMaterial( { color: 0xff0000, flatShading: true } );
                child.scale.set(4, 4, 4);
            }
        });

        this.car.traverse(function( child )
        {
            if ( child instanceof THREE.Object3D )
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // this.car.receiveShadow = true;

        scene.add(this.car);

        const geometry2 = new THREE.SphereGeometry(10, mesh_size, mesh_size);
        // this.geometry = geometry;

        const material2 = new THREE.MeshStandardMaterial( { color: 0x000ff0 } );
        const sphere2 = new THREE.Mesh(geometry2, material2);

        sphere2.position.set(0, 200, 0);

        sphere2.receiveShadow = true;
        sphere2.castShadow = true;

        // scene.add(sphere2);

        instance = this;

        this.geometry = geometry;

        this.updateNormals();
    }

    normals = [];

    mesh_size = mainjs.mesh_size;
    inner_size = mainjs.inner_size;

    // posX = 1;
    // posY = 1;

    posX = mesh_size * inner_size / 2.0;
    posY = mesh_size * inner_size / 2.0;

    onKeyDown(e) {
        if (e.keyCode === 87) {
            instance.posY = succMod(instance.posY, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 65) {
            instance.posX = succMod(instance.posX, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 83) {
            instance.posY = predMod(instance.posY, instance.mesh_size * instance.inner_size);
        } else if (e.keyCode === 68) {
            instance.posX = predMod(instance.posX, instance.mesh_size * instance.inner_size);
        }
        instance.updateCoordinates();
    }

    updateNormals () {
        let normals = this.normals;
        for (let ind = 0, max = this.geometry.faces.length; ind < max; ind++) {
            const face = this.geometry.faces[ind];
            const faceNormals = face.vertexNormals;
            if (normals.length <= face.a) {
                normals.push(faceNormals[0]);
            }
            if (normals.length <= face.b) {
                normals.push(faceNormals[1]);
            }
            if (normals.length <= face.c) {
                normals.push(faceNormals[2]);
            }
        }
    }

    updateCoordinates () {
        const debug_mode = false;

        let posX = this.posX; let posY = this.posY;
        let inner_size = this.inner_size; let mesh_size = this.mesh_size;

        let indices, triangle, baryCoordinate;

        let indX = Math.floor(posX / inner_size);
        let indY = Math.floor(posY / inner_size);

        let cf1 = posX / inner_size - indX;
        let cf2 = 1 - (posX / inner_size - indX);
        let cf3 = posY / inner_size - indY;

        if (indY === 0) {
            let index1 = 0;
            let index2 = 1 + indX;
            let index3 = 1 + (indX + 1) % mesh_size;

            let point0 = this.geometry.vertices[index1];
            let point1 = this.geometry.vertices[index2];
            let point2 = this.geometry.vertices[index3];

            indices = [index1, index2, index3];

            triangle = new THREE.Triangle(
                point0, point1, point2
            );

            baryCoordinate = new THREE.Vector3(
                2 * (1 - cf3) / (cf1 + cf2 + 2 * (1 - cf3)),
                cf2 / (cf1 + cf2 + 2 * (1 - cf3)),
                cf1 / (cf1 + cf2 + 2 * (1 - cf3))
            );
        } else if (indY === mesh_size - 1) {

            let index1 = 1 + (indY - 1) * mesh_size + indX;
            let index2 = mesh_size * (mesh_size - 1) + 1;
            let index3 = 1 + (indY - 1) * mesh_size + (indX + 1) % mesh_size;

            let point0 = this.geometry.vertices[index1];
            let point1 = this.geometry.vertices[index2];
            let point2 = this.geometry.vertices[index3];

            indices = [index1, index2, index3];

            triangle = new THREE.Triangle(
                point0, point1, point2
            );

            baryCoordinate = new THREE.Vector3(
                cf2 / (cf1 + cf2 + 2 * cf3),
                2 * cf3 / (cf1 + cf2 + 2 * cf3),
                cf1 / (cf1 + cf2 + 2 * cf3),
            );
        } else {
            let index1 = 1 + (indY - 1) * mesh_size + indX;
            let index2 = 1 + (indY - 1) * mesh_size + (indX + 1) % mesh_size;
            let index3 = 1 + indY * mesh_size + indX;
            let index4 = 1 + indY * mesh_size + (indX + 1) % mesh_size;

            let point1 = this.geometry.vertices[index1];
            let point2 = this.geometry.vertices[index2];
            let point3 = this.geometry.vertices[index3];
            let point4 = this.geometry.vertices[index4];

            let triangle1 = new THREE.Triangle(
                new THREE.Vector3(indX, indY, 0),
                new THREE.Vector3(indX, indY + 1, 0),
                new THREE.Vector3(indX + 1, indY + 1, 0)
            );
            let triangle2 = new THREE.Triangle(
                new THREE.Vector3(indX, indY, 0),
                new THREE.Vector3(indX + 1, indY + 1, 0),
                new THREE.Vector3(indX + 1, indY, 0)
            );

            let baryCoordinate1 = triangle1.getBarycoord(new THREE.Vector3(posX / inner_size, posY / inner_size, 0));
            let baryCoordinate2 = triangle2.getBarycoord(new THREE.Vector3(posX / inner_size, posY / inner_size, 0));

            if (baryCoordinate1.x >= 0 && baryCoordinate1.y >= 0 && baryCoordinate1.z >= 0) {
                indices = [index1, index3, index4];

                triangle = new THREE.Triangle(
                    point1, point3, point4
                );
                baryCoordinate = baryCoordinate1;
            } else if (baryCoordinate2.x >= 0 && baryCoordinate2.y >= 0 && baryCoordinate2.z >= 0) {
                indices = [index1, index4, index2];
                triangle = new THREE.Triangle(
                    point1, point4, point2
                );
                baryCoordinate = baryCoordinate2;
            } else {
                warn("PROBLEM WITH TRIANGLES!");
            }
        }

        const normals = this.normals;

        let normal = new THREE.Vector3()
            .add(normals[indices[0]].clone().multiplyScalar(baryCoordinate.x))
            .add(normals[indices[1]].clone().multiplyScalar(baryCoordinate.y))
            .add(normals[indices[2]].clone().multiplyScalar(baryCoordinate.z));

        let point = new THREE.Vector3(0, 0, 0)
            .add(triangle.a.clone().multiplyScalar(baryCoordinate.x))
            .add(triangle.b.clone().multiplyScalar(baryCoordinate.y))
            .add(triangle.c.clone().multiplyScalar(baryCoordinate.z));

        this.car.position.copy(point.add(triangle.getNormal()));

        this.car.lookAt(new THREE.Vector3().add(this.car.position).add(normal.clone().multiplyScalar(3)));

        console.log(this.car.position);
    }
}

function succMod(a, b) {
    return (a + 1) % b;
}

function predMod(a, b) {
    if (a - 1 < 0) {
        return a - 1 + b;
    } else {
        return a - 1;
    }
}