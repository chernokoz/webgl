import * as THREE from 'three-full';

function createAxialLine (color, direction) {
  const material = new THREE.LineBasicMaterial({
    color: color
  });

  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(0, 0, 0),
    direction.clone().multiplyScalar(100)
  );

  return new THREE.Line(geometry, material);
}

function createAxialCylinder (color, relPosition, rotation) {
  const radius = 0.5;
  const length = 20;

  const geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
  const material = new THREE.MeshBasicMaterial({color: color});
  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.x = relPosition.x * length / 2;
  cylinder.position.y = relPosition.y * length / 2;
  cylinder.position.z = relPosition.z * length / 2;
  // cylinder.position.x = 10;
  cylinder.rotation.x = rotation.x;
  cylinder.rotation.y = rotation.y;
  cylinder.rotation.z = rotation.z;

  return cylinder;
}

export function createAxes () {
  const root = new THREE.Object3D();

  root.add(createAxialCylinder(new THREE.Color(1, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 0, Math.PI / 2)));
  root.add(createAxialCylinder(new THREE.Color(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Euler(0, 0, 0)));
  root.add(createAxialCylinder(new THREE.Color(0, 0, 1), new THREE.Vector3(0, 0, 1), new THREE.Euler(Math.PI / 2, 0, 0)));

  root.add(createAxialLine(new THREE.Color(1, 0, 0), new THREE.Vector3(1, 0, 0)));
  root.add(createAxialLine(new THREE.Color(0, 1, 0), new THREE.Vector3(0, 1, 0)));
  root.add(createAxialLine(new THREE.Color(0, 0, 1), new THREE.Vector3(0, 0, 1)));

  Sphere: {
    const geometry = new THREE.SphereGeometry(2.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const sphere = new THREE.Mesh(geometry, material);
    root.add(sphere);

    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframeGeometry);
    line.material.depthTest = true;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.lineWidth = 2;
    line.material.color.setHex(0x000000);

    root.add(line);
  }

  return root;
}
