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
    
    var sceneView: ARSCNView!
    var testView: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()
        self.sceneView = ARSCNView()
        self.view.addSubview(self.sceneView)
        self.sceneView.frame = view.frame
        self.sceneView.translatesAutoresizingMaskIntoConstraints = false
        // シーンを生成してARSCNViewにセット
        self.sceneView.scene = SCNScene(named: "art.scnassets/ship.scn")!

        // セッションのコンフィギュレーションを生成
        let configuration = ARWorldTrackingConfiguration()
        
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

