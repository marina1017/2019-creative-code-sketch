//
//  ViewController.swift
//  09-ARtest
//
//  Created by 中川万莉奈 on 2019/12/22.
//  Copyright © 2019 中川万莉奈. All rights reserved.
//

import UIKit
import SceneKit
import ARKit

class ARViewController: UIViewController {
    //ARKit関連の機能をとりあつかいつつ、UIKitベースのUI階層内で三次元シーンを描画するためのクラス
    var sceneView: ARSCNView!

    override func viewDidLoad() {
        super.viewDidLoad()
        self.sceneView = ARSCNView()
        self.sceneView.delegate = self
        self.view.addSubview(self.sceneView)
        self.sceneView.frame = view.frame
        self.sceneView.translatesAutoresizingMaskIntoConstraints = false
        // シーンを生成してARSCNViewにセット
        self.sceneView.scene = SCNScene(named: "art.scnassets/ship.scn")!
        //self.sceneView.scene = SCNScene(named: "art.scnassets/Raikou/model.scn")!

        // セッションのコンフィギュレーションを生成
        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = [.horizontal, .vertical]
        
        // セッション開始
        self.sceneView.session.run(configuration)
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        //SafeAreaができたら制約をかける
        self.constraints()
        
    }

    func constraints() {
        // redViewの横方向の中心は、親ビューの横方向の中心と同じ
        self.sceneView.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        // redViewの縦方向の中心は、親ビューの縦方向の中心と同じ
        self.sceneView.centerYAnchor.constraint(equalTo: self.view.centerYAnchor).isActive = true
        // redViewの幅は、親ビューの幅
        self.sceneView.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        // redViewの親ビューの幅
        self.sceneView.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 1).isActive = true
        
    }

}

extension ARViewController: ARSCNViewDelegate {
    
    // 新しいアンカーに対応するノードがシーンに追加された
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        print("anchor:\(anchor), node: \(node), node geometry: \(String(describing: node.geometry))")
        guard let planeAnchor = anchor as? ARPlaneAnchor else { fatalError() }
        // アライメントによって色をわける
        let color: UIColor = planeAnchor.alignment == .horizontal ? UIColor.yellow : UIColor.blue
        
        //平面ジオメトリを作成
        let geometry = SCNPlane(width: CGFloat(planeAnchor.extent.x),
                                height: CGFloat(planeAnchor.extent.z))
        geometry.materials.first?.diffuse.contents = UIColor.yellow
        //平面ジオメトリを持つノードを作成
        let planeNode = SCNNode(geometry: geometry)
        
        //平面ジオメトリを持つノードをx軸まわりに90度回転
        planeNode.transform = SCNMatrix4MakeRotation(-Float.pi/2.0, 1, 0, 0)
        
        DispatchQueue.main.async{
            //検出したアンカーに対応するノードに子ノードとしてもたせる
            node.addChildNode(planeNode)
        }
        
        // 平面ジオメトリを持つノードを作成し、
        // 検出したアンカーに対応するノードに子ノードとして持たせる
//        planeAnchor.addPlaneNode(on: node, contents: color.withAlphaComponent(0.3))
    }
    
    // 対応するアンカーの現在の状態に合うようにノードが更新された
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
//        guard let planeAnchor = anchor as? ARPlaneAnchor else {fatalError()}
//        planeAnchor.updatePlaneNode(on: node)
    }
    
    // 削除されたアンカーに対応するノードがシーンから削除された
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
//        print("\(self.classForCoder)/" + #function)
//        guard let planeAnchor = anchor as? ARPlaneAnchor else {fatalError()}
//        planeAnchor.findPlaneNode(on: node).removeFromParentNode()
    }
}


